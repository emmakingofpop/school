"use client"
import React, { use, useEffect, useState } from 'react'
import SignupPage from './signup'

interface Props {
  params: {
    id: string
  }
}

function Prof({params}: {params: Promise<{ id: string }>;}) {
  
  const { id } = use(params)

  return (
    <div>
      <SignupPage id={id} />
    </div>
  )
}

export default Prof
