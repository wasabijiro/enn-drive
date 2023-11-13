import React, { useRef, useEffect } from 'react';

interface PieChartProps {
    data: { value: number; color: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            let total = data.reduce((sum, entry) => sum + entry.value, 0);
            let startAngle = 0;

            data.forEach(entry => {
                const sliceAngle = (entry.value / total) * 2 * Math.PI;
                context.beginPath();
                context.arc(150, 150, 100, startAngle, startAngle + sliceAngle);
                context.lineTo(150, 150);
                context.fillStyle = entry.color;
                context.fill();
                startAngle += sliceAngle;
            });
        }
    }, [data]);

    return <canvas ref={canvasRef} width={300} height={300} />;
};

export default PieChart;
