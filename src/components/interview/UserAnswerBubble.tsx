interface Props {
  answer: string;
}

export const UserAnswerBubble = ({ answer }: Props) => {
  return (
    <div className="ml-6 mt-3 max-w-xl border-l-2 border-vd-border-strong/60 pl-5 py-1">
      <p className="font-mono-label text-[9px] tracking-[0.18em] text-vd-t3 mb-1.5">
        YOUR ANSWER
      </p>
      <p className="text-[14px] text-vd-t2 leading-[1.65]">{answer}</p>
    </div>
  );
};
