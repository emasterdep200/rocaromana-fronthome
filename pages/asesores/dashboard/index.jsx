import React from "react";
//import AsesorDashboard from '@/Components/Asesor/AsesorDashboard.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from "next/dynamic";
const AsesorDashboard = dynamic(() => import("@/Components/Asesor/AsesorDashboard"), { ssr: false });
const Index = () => {

    return (
        <>
            <Meta
                title=""
                description=""
                keywords=""
                ogImage=""
                pathName=""
            />
            <AsesorDashboard />
        </>
    );
};

export default Index;
