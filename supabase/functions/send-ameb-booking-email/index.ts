// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'; // Import createClient

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use SERVICE_ROLE_KEY
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { studentParentName, contactEmail, examDate, examTime, examBoardGrade, teacherName, serviceRequired } = await req.json();

    if (!studentParentName || !contactEmail || !examDate || !examTime || !examBoardGrade || !serviceRequired || serviceRequired.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields for AMEB booking inquiry' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert data into the new 'ameb_bookings' table
    const { error: insertError } = await supabaseClient
      .from('ameb_bookings')
      .insert([
        {
          student_parent_name: studentParentName,
          contact_email: contactEmail,
          exam_date: examDate,
          exam_time: examTime,
          exam_board_grade: examBoardGrade,
          teacher_name: teacherName,
          service_required: serviceRequired,
          status: 'pending', // Default status
        },
      ]);

    if (insertError) {
      console.error('Supabase insert error for AMEB booking:', insertError);
      throw new Error(`Failed to save AMEB booking: ${insertError.message}`);
    }

    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (!EMAIL_SERVICE_API_KEY || !CONTACT_FORM_RECIPIENT_EMAIL || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Missing email service environment variables for AMEB booking.');
      // We still return success for the client, but log the server error
      return new Response(JSON.stringify({ message: 'AMEB booking saved, but email notification failed due to server config.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `🎶 New AMEB Booking Inquiry from ${studentParentName}`;
    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #fdb813; text-align: center; margin-bottom: 20px;">New AMEB Booking Inquiry!</h2>
          <p style="font-size: 16px; line-height: 1.6;">A new AMEB accompanying service inquiry has been submitted:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 180px;">Student / Parent Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${studentParentName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Contact Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><a href="mailto:${contactEmail}" style="color: #fdb813; text-decoration: none;">${contactEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Exam Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${examDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Exam Time:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${examTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Exam Board & Grade:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${examBoardGrade}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Teacher Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${teacherName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold;">Service(s) Required:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">
                <ul style="margin: 0; padding-left: 20px;">
                  ${serviceRequired.map((service: string) => `<li>${service}</li>`).join('')}
                </ul>
              </td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
            This notification was sent from your website.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await fetch(EMAIL_SERVICE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'info@danielebuatti.com',
        to: CONTACT_FORM_RECIPIENT_EMAIL,
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Email service error for AMEB booking:', errorData);
      throw new Error(`Failed to send AMEB booking email: ${emailResponse.statusText}`);
    }

    console.log(`Email notification sent for AMEB booking successfully!`);

    return new Response(JSON.stringify({ message: `AMEB booking saved and email notification sent.` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Edge Function error for AMEB booking:', (error as Error).message);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});