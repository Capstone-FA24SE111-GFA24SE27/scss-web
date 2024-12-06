
// Helper function to render HTML
import "./render-html.css"

export const RenderHTML = (htmlString: string) => {
  return <div className="rendered-html" dangerouslySetInnerHTML={ { __html: htmlString } } />;
};
