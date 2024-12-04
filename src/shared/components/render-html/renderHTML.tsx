
// Helper function to render HTML
export const RenderHTML = (htmlString: string) => {
  return <div dangerouslySetInnerHTML={ { __html: htmlString } } />;
};
