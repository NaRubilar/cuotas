export default function Field({
  label,
  iconNode,
  children,
}: {
  label: string;
  iconNode?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <div className="fieldLabel">{label}</div>
      <div className="fieldRow">
        {iconNode ? <div className="fieldIcon">{iconNode}</div> : null}
        {children}
      </div>
      <div className="underline" />
    </div>
  );
}
