import React from "react";
//import Ventas from "@/Components/Asesor/Ventas";
import Meta from "@/Components/Seo/Meta";
import dynamic from "next/dynamic";
const Ventas = dynamic(() => import("@/Components/Asesor/Ventas"), { ssr: false });

const Index = () => {
    return (
        <>
            <Meta
                title="Título de la Página"
                description="Descripción de la página."
                keywords="palabras clave, seo"
                ogImage="/default-image.jpg"
                pathName="/ventas"
            />
            <Ventas />
        </>
    );
};

export default Index;