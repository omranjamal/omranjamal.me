import { TypeAnimation } from "react-type-animation";

export default function Loves() {
  return (
    <TypeAnimation
      sequence={[
        "building software that supercharges human capabilities.",
        2000,
        "building teams that continously ship the impossible.",
        2000,
        "building software that provides value since v0.1.0-alpha.",
        2000,
        "building teams that are unfazed by the unknown.",
        2000,
      ]}
      speed={90}
      repeat={Infinity}
      omitDeletionAnimation={true}
      preRenderFirstString={true}
    />
  );
}
