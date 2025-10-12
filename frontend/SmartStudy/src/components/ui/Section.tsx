import React from 'react';

type SectionProps = {
    children: React.ReactNode;
    className?: string;
};

const Section = ({ children, className }: SectionProps) => {
    return (
        <section className={`py-16 sm:py-24 lg:py-32 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
};

export default Section;
