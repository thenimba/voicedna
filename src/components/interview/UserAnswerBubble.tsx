interface Props {
  answer: string;
}

export const UserAnswerBubble = ({ answer }: Props) => {
  return (
    <div className="ml-5 mt-2 bg-vd-surface border border-vd-border rounded-lg py-3 px-4 max-w-xl">
      <p className="text-[13px] text-vd-t2 leading-[1.6]">{answer}</p>
    </div>
  );
};
