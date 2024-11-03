import { useState } from "react";
import clsx from 'clsx';

type Props = {
  text: string
  limit?: number,
  className?: string
}

const ExpandableText = ({ text, limit = 300, className = "" }: Props) => {
  const [showMore, setShowMore] = useState(false);
  if (text.length < limit) {
    return <div className={className}>{text}</div>
  }
  return (
    <div className={clsx(`flex-1`, className)}>
      {showMore ? text : `${text.substring(0, limit)}...`}{' '}
      <span
        className={clsx("text-secondary-main hover:text-secondary-light font-semibold cursor-pointer")}
        onClick={() => setShowMore(!showMore)}>
        {showMore ? "Show less" : "Show more"}
      </span>
    </div>
  )
}

export default ExpandableText