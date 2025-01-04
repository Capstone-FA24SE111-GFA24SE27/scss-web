
// Helper function to render HTML
import "./RenderHTML.css"

export const RenderHTML = (htmlString: string) => {
  return <div className="rendered-html" dangerouslySetInnerHTML={ { __html: htmlString } } />;
};
