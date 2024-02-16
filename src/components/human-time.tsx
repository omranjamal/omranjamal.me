import { useEffect, useState } from "react";
import { format } from "timeago.js";

export function HumanTime({ time }: { time: Date }) {
  const [renderTime, setRenderTime] = useState(false);

  useEffect(() => {
    setRenderTime(true);
  }, [setRenderTime]);

  return (
    <span
      title={
        renderTime
          ? time.toLocaleString("en-gb", {
              dateStyle: "full",
              timeStyle: "full",
              hour12: true,
            })
          : ""
      }
    >
      {format(time, "en_GB")}
    </span>
  );
}
