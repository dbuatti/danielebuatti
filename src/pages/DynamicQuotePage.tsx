const updateFavicon = (rel: string) => {
      let link: HTMLLinkElement | null = document.querySelector(`link[rel*='${rel}']`) as HTMLLinkElement;
      if (link) {
        link.href = '/blue-pink-ontrans.png?v=1';
      }
};