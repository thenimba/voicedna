interface Props {
  question: string;
  isFollowUp?: boolean;
}

export const QuestionBubble = ({ question, isFollowUp }: Props) => {
  return (
    <div
      className={`relative max-w-2xl py-5 pl-6 pr-5 border-l-2 ${
        isFollowUp
          ? "bg-vd-amber-bg border-l-vd-amber-btn"
          : "bg-vd-cream border-l-vd-accent"
      }`}
    >
      {isFollowUp && (
        <span className="font-mono-label text-[9px] tracking-[0.18em] text-vd-amber block mb-2">
          PUSHBACK · STAY SPECIFIC
        </span>
      )}
      <p
        className={`font-serif-question text-[18px] md:text-[19px] leading-[1.5] ${
          isFollowUp ? "text-vd-amber italic" : "text-vd-t1"
        }`}
      >
        {question}
      </p>
    </div>
  );
};
