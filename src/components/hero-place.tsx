import Image from "next/image";
import { Button } from "./ui/button";
export const Hero = () => {
  return (
    <div className="flex items-center justify-between gap-5 pt-24 w-full">
      <div className="basis-1/2 space-y-3">
        <h2 className="text-8xl font-bold">
          <span className=" font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Teach
          </span>{" "}
          a Skill, Learn a{" "}
          <span className="font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Skill
          </span>
        </h2>
        <p>
          Learn something new by teaching what you already know — SkillSwap
          connects passionate learners and skilled teachers in a value-for-value
          exchange.
        </p>
        <Button>Start here</Button>
      </div>
      <div className="relative aspect-square basis-1/2">
        <Image
          src="/images/hero.png"
          alt="hero-image"
          height={1000}
          width={1000}
        />
      </div>
    </div>
  );
};
