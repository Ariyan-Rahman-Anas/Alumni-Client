'use client';

interface TimeFormatterProps {
  isoString: string;
}

const TimeFormatter: React.FC<TimeFormatterProps>  = ({ isoString }) => {

    const date = new Date(isoString);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    return (
        <p className="text-text-secondary/80">
            {`${month}-${year}`}
    </p>
  )
}
export default TimeFormatter