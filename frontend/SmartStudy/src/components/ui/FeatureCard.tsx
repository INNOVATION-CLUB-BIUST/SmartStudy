import React from 'react';

type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
    return (
        <div className="pt-6">
            <div className="flow-root bg-slate-50 rounded-lg px-6 pb-8 h-full">
                <div className="-mt-6">
                    <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                            {icon}
                        </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-slate-900 tracking-tight">{title}</h3>
                    <p className="mt-5 text-base text-slate-500">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default FeatureCard;
