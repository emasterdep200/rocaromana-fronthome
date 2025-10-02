"use client"
import Meta from '@/Components/Seo/Meta'
import React from 'react'
//import UserPublicidad from '@/Components/User/UserPublicidad.jsx'
import dynamic from "next/dynamic";
const UserPublicidad = dynamic(() => import("@/Components/User/UserPublicidad"), { ssr: false });


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
            <UserPublicidad />
        </>
    )
}

export default Index
