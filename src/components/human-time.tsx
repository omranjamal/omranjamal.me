import { format } from "timeago.js";

export function HumanTime({time}: {time: Date}) {
    return <span>{format(time, "en_US")}</span>
}
