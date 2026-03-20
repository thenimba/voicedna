interface Props {
  question: string;
  isFollowUp?: boolean;
}

export const QuestionBubble = ({ question, isFollowUp }: Props) => {
  return (
    <div
      className={`rounded-r-lg py-3.5 px-4 max-w-2xl ${
        isFollowUp
          ? "bg-vd-amber-bg border-l-2 border-l-amber-400"
          : "bg-vd-cream border-l-2 border-l-vd-accent"
      }`}
    >
      <p
        className={`font-serif-question text-[16px] leading-[1.6] ${
          isFollowUp ? "text-vd-amber" : "text-vd-t1"
        }`}
        style={{ fontStyle: "normal" }}
      >
        {isFollowUp ? `"${question}"` : question}
      </p>
    </div>
  );
};
