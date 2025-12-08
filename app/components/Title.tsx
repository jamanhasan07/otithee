type TitleProps = {
  title: string;
  subTitle?: string;
  align?: "left" | "center";
};

const Title = ({ title, subTitle, align = "left" }: TitleProps) => {
  const alignClasses =
    align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <div className={`flex flex-col mb-6 gap-2 ${alignClasses}`}>
      {/* Small accent label / pill */}
      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        Otithee ERP
      </span>

      {/* Main title */}
      <h3 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h3>

      {/* Subtitle / description */}
      {subTitle && (
        <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
          {subTitle}
        </p>
      )}

      {/* Accent line */}
      <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
    </div>
  );
};

export default Title;
