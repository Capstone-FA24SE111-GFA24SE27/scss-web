
// Helper function to render HTML
export const renderHTML = (htmlString: string) => {
  return <div dangerouslySetInnerHTML={ { __html: htmlString } } />;
};
