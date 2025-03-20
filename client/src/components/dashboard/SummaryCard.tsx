interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: string;
  changeText: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  linkText: string;
  linkUrl: string;
  iconColor: string;
}

const SummaryCard = ({
  title,
  value,
  icon,
  changeText,
  changeType,
  linkText,
  linkUrl,
  iconColor
}: SummaryCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm card-hover">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-ibm text-sm font-medium text-gray-500">{title}</h3>
        <i className={`${icon} ${iconColor}`}></i>
      </div>
      <p className="text-2xl font-ibm font-semibold">{value}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className={`text-xs ${changeType === 'increase' ? 'text-success' : changeType === 'decrease' ? 'text-danger' : 'text-gray-500'} flex items-center`}>
          {changeType === 'increase' && <i className="ri-arrow-up-line mr-1"></i>}
          {changeType === 'decrease' && <i className="ri-arrow-down-line mr-1"></i>}
          {changeText}
        </span>
        <a href={linkUrl} className="text-xs text-accent hover:underline">{linkText}</a>
      </div>
    </div>
  );
};

export default SummaryCard;
