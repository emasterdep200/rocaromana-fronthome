"use client"
import React from 'react'
import VerticleLayoutAsesor from "./VerticleLayout";


const AdminLayoutAsesor = (props) => {


  const { children } = props
  return (


    <VerticleLayoutAsesor>
      {children}
    </VerticleLayoutAsesor>
  )
}

export default AdminLayoutAsesor
