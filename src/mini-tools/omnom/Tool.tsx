import clsx from "clsx";
import {
  useCallback,
  useState,
  type PropsWithChildren,
  useMemo,
  useEffect,
} from "react";
import { data } from "./data.mts";
import _ from "lodash";

const order = Object.entries(
  _.countBy(
    data
      .map((restaurant) =>
        Object.entries(_.omit(restaurant, "name")).map(([key, value]) => ({
          key: key,
          value: value === "TRUE" ? true : false,
        }))
      )
      .flat()
      .filter((inst) => !inst.value),
    "key"
  )
)
  .map(([key, value]) => [key, Math.max(value, data.length - value)])
  .sort(([, a]: any, [, b]: any) => b - a)
  .map(([key]) => key);

export type bools =
  | "is_fine_dining"
  | "is_old"
  | "is_fish"
  | "is_asian"
  | "is_experimental"
  | "is_cheesy";

export function Question({ children }: PropsWithChildren) {
  return <div className="font-black text-5xl my-12 px-10">{children}</div>;
}

export function Button({
  children,
  onClick = () => {},
  className = "",
}: PropsWithChildren<{
  onClick?: () => void;
  className?: string;
}>) {
  return (
    <button
      className={clsx("my-2 py-2 text-4xl font-bold px-6 mx-6", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function filter(conditions) {
  return data.filter((restaurant) => {
    return Object.entries(conditions).every(
      ([key, value]) => restaurant[key] === (value ? "TRUE" : "FALSE")
    );
  });
}

export default function Tool() {
  const [conditions, setConditions] = useState({});
  const [step, setStep] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);

  const reset = useCallback(() => {
    setStep(0);
    setConditions({});
  }, [setStep, setConditions]);

  const random = useCallback(
    () => setStep(0.49 + Math.random() * 0.5),
    [setStep]
  );

  const next = useCallback(() => setStep((step) => step + 1), [setStep]);
  const prev = useCallback(() => {
    setStep((step) => {
      setConditions((conditions) => {
        const next = { ...conditions };
        delete next[order[step - 3]];

        return next;
      });

      return Math.max(step - 1, 0);
    });
  }, [setStep, setConditions]);

  const nextRestaurant = useCallback(() => {
    setIndex((index) => index + 1);
  }, [setIndex]);

  const prevRestaurant = useCallback(() => {
    setIndex((index) => Math.max(index - 1, 0));
  }, [setIndex]);

  const set = useCallback(
    (key: string, needed: boolean) => {
      setConditions((conditions) => ({ ...conditions, [key]: needed }));
      next();
    },
    [next, setConditions]
  );

  const restaurants = useMemo(() => {
    return filter(conditions);
  }, [conditions]);

  const isRandom = step % 1 > 0;

  return (
    <div className="py-6 w-full flex flex-col items-center text-center">
      {isRandom ? (
        <>
          <Question>
            {data[Math.round(Math.random() * (data.length - 1))].name}
          </Question>
          <Button className="bg-red-500 text-white" onClick={random}>
            🎲 Random
          </Button>
          <Button className="bg-red-500 text-white" onClick={reset}>
            🔄 Reset
          </Button>
        </>
      ) : restaurants.length === 1 ? (
        <>
          <Question>{restaurants[0].name}</Question>
          <Button
            className="border-2 border-red-500 text-red-500"
            onClick={prev}
          >
            Back
          </Button>
          <Button className="bg-red-500 text-white" onClick={reset}>
            🔄 Reset
          </Button>
        </>
      ) : step === 0 ? (
        <>
          <Question>Will You Be My Valentine?</Question>
          <Button className="bg-red-500 text-white" onClick={next}>
            Yes
          </Button>
          <Button
            className="bg-red-500 text-white"
            onClick={() =>
              window.confirm(
                "Life; is all about choices; and today, you chose wrong."
              )
            }
          >
            No
          </Button>
        </>
      ) : step === 1 ? (
        <>
          <Question>Let's decide where to eat shall we?</Question>
          <Button className="bg-red-500 text-white" onClick={next}>
            Start 👉
          </Button>
          <Button className="bg-red-500 text-white" onClick={random}>
            🎲 Random
          </Button>
          <Button className="bg-red-500 text-white" onClick={reset}>
            🔄 Reset
          </Button>
        </>
      ) : step >= 2 && step < 8 ? (
        <>
          <div>
            {step - 1} / 6 — {restaurants.length} potentail restaurant(s)
          </div>
          {order[step - 2] === "is_fine_dining" ? (
            <>
              <Question>
                Are we doing fancy fine dining or casual eating?
              </Question>
              {filter({ ...conditions, is_fine_dining: true }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_fine_dining", true)}
                >
                  Fancy ✨ (
                  {filter({ ...conditions, is_fine_dining: true }).length})
                </Button>
              ) : (
                <span>You saah hip and trendy, no fancy for you gurrl.</span>
              )}
              {filter({ ...conditions, is_fine_dining: false }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_fine_dining", false)}
                >
                  Casual 👕 (
                  {filter({ ...conditions, is_fine_dining: false }).length})
                </Button>
              ) : (
                <span>You saah fancy, no casual for you gurrrl.</span>
              )}
            </>
          ) : order[step - 2] === "is_old" ? (
            <>
              <Question>
                Are we trying a new place, or going to somewhere we already know
                we'll be comfortable?
              </Question>
              {filter({ ...conditions, is_old: false }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_old", false)}
                >
                  New & Exciting 🆕 (
                  {filter({ ...conditions, is_old: false }).length})
                </Button>
              ) : (
                <span>Your choices seem to prefer old and safe.</span>
              )}
              {filter({ ...conditions, is_old: true }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_old", true)}
                >
                  Old & Comfortable ☕ (
                  {filter({ ...conditions, is_old: true }).length})
                </Button>
              ) : (
                <span>Gotta go for something new.</span>
              )}
            </>
          ) : order[step - 2] === "is_fish" ? (
            <>
              <Question>We're having something fishy or meaty?</Question>
              {filter({ ...conditions, is_fish: true }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_fish", true)}
                >
                  🤔 Fishy 🐟 ({filter({ ...conditions, is_fish: true }).length}
                  )
                </Button>
              ) : (
                <span>
                  <s>There are lots of fish in the sea.</s>
                </span>
              )}
              {filter({ ...conditions, is_fish: false }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_fish", false)}
                >
                  🍗 Meaty 🥩 (
                  {filter({ ...conditions, is_fish: false }).length})
                </Button>
              ) : (
                <span>404: meat not found</span>
              )}
            </>
          ) : order[step - 2] === "is_asian" ? (
            <>
              <Question>
                Do we wanna have asian or do we pretend to be white?
              </Question>
              {filter({ ...conditions, is_asian: true }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_asian", true)}
                >
                  Asian 🍚 ({filter({ ...conditions, is_asian: true }).length})
                </Button>
              ) : (
                <span>
                  Based on your choices, you might as well be actually white.
                </span>
              )}
              {filter({ ...conditions, is_asian: false }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_asian", false)}
                >
                  🥛 We White (
                  {filter({ ...conditions, is_asian: false }).length})
                </Button>
              ) : (
                <span>
                  I lied, there is only Asian Restauarnts in the dataset.
                </span>
              )}
            </>
          ) : order[step - 2] === "is_experimental" ? (
            <>
              <Question>How adventerous are we feeling?</Question>
              {filter({ ...conditions, is_experimental: true }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_experimental", true)}
                >
                  11/10 (
                  {filter({ ...conditions, is_experimental: true }).length})
                </Button>
              ) : (
                <span>Your choices be kinda safe today.</span>
              )}
              {filter({ ...conditions, is_experimental: false }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_experimental", false)}
                >
                  9/10 (
                  {filter({ ...conditions, is_experimental: false }).length})
                </Button>
              ) : (
                <span>
                  You choose those choices and think it won't be experimental?
                </span>
              )}
            </>
          ) : order[step - 2] === "is_cheesy" ? (
            <>
              <Question>Do we wanna have something cheezy or nah?</Question>
              {filter({ ...conditions, is_cheesy: true }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_cheesy", true)}
                >
                  Cheesy Premik + Date 🧀 (
                  {filter({ ...conditions, is_cheesy: true }).length})
                </Button>
              ) : (
                <span>404: cheesy restaurants not found</span>
              )}
              {filter({ ...conditions, is_cheesy: false }).length ? (
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => set("is_cheesy", false)}
                >
                  No. 🔫 ({filter({ ...conditions, is_cheesy: false }).length})
                </Button>
              ) : (
                <span>Literally nothing is not cheesy.</span>
              )}
            </>
          ) : null}
          <Button
            className="border-2 border-red-500 text-red-500"
            onClick={reset}
          >
            🔄 Reset
          </Button>
          <Button
            className="border-2 border-red-500 text-red-500"
            onClick={prev}
          >
            Back
          </Button>
        </>
      ) : step === 8 ? (
        <>
          <Question>{restaurants[index % restaurants.length].name}</Question>
          <div className="flex flex-row">
            <Button className="bg-red-500 text-white" onClick={prevRestaurant}>
              👈
            </Button>
            <Button className="bg-red-500 text-white" onClick={nextRestaurant}>
              👉
            </Button>
          </div>
          <Button
            className="border-2 border-red-500 text-red-500"
            onClick={prev}
          >
            Back
          </Button>
          <Button className="bg-red-500 text-white" onClick={reset}>
            🔄 Reset
          </Button>
        </>
      ) : null}
    </div>
  );
}
