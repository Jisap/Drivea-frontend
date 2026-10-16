import React, { useState } from 'react'

const ShareModal = ({ item, isOpen, onClose }) => {

  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [shareLinkId, setShareLinkId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>ShareModal</div>
  )
}

export default ShareModal