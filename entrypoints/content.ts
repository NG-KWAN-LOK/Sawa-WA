export default defineContentScript({
  matches: ["*://web.whatsapp.com//*"],
  runAt: "document_end",
  main() {
    storage.watch<number>("local:backgroundImageUrl", (newCount) => {
      const chatBackground = document.querySelector(
        "[data-asset-chat-background-dark]"
      );
      if (chatBackground instanceof HTMLElement) {
        chatBackground.style.backgroundImage = `url(${newCount})`;
        chatBackground.style.backgroundSize = "cover";
        chatBackground.style.opacity = "1";
        chatBackground.style.backgroundPosition = "center";
      }
      return;
    });

    storage.watch<number>("local:backgroundImageBrightness", (newCount) => {
      const chatBackground = document.querySelector(
        "[data-asset-chat-background-dark]"
      );
      if (chatBackground instanceof HTMLElement) {
        chatBackground.style.opacity = `${newCount}`;
      }
      return;
    });

    const observer = new MutationObserver(async (mutations) => {
      const isChildListChanged = mutations.some(
        (mutation) =>
          mutation.type === "childList" && mutation.addedNodes.length > 0
      );

      if (isChildListChanged) {
        const imageUrl = (await storage.getItem(
          "local:backgroundImageUrl"
        )) as unknown as string | null;

        const imageBrightness = (await storage.getItem(
          "local:backgroundImageBrightness"
        )) as unknown as string | null;

        const chatBackground = document.querySelector(
          "[data-asset-chat-background-dark]"
        );
        if (chatBackground instanceof HTMLElement) {
          chatBackground.style.backgroundImage = `url(${imageUrl})`;
          chatBackground.style.backgroundSize = "cover";
          chatBackground.style.opacity = imageBrightness || "1";
          chatBackground.style.backgroundPosition = "center";
        }

        observer.disconnect();

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
