import { useState } from "react";

type Props = {
  text: string
  limit: number
}

const ExpendableText = ({ text, limit }: Props) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div>
      {showMore ? text : `${text.substring(0, limit)}...`}{' '}
      <button className="text-accent hover:opacity-80 dark:hover:text-primary-light font-semibold" onClick={() => setShowMore(!showMore)}>
        {showMore ? "Show less" : "Show more"}
      </button>
    </div>
  )
}

export default ExpendableText