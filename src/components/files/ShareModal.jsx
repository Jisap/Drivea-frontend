import React, { useCallback, useState } from 'react'
import { Modal } from '../ui/Modal';
import { CheckIcon, CopyIcon, Loader2Icon, XIcon } from 'lucide-react';
import { Button } from '../ui/Button';

const ShareModal = ({ item, isOpen, onClose }) => {

  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [shareLinkId, setShareLinkId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getOrCreateShareLink = useCallback(async (params) => {

  });

  const copyToClipboard = () => {

  }

  const handleDeleteShareLink = async () => {

  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share "${item?.name}"`}
    >
      <div className='space-y-4'>
        {/* Access level Badge */}
        <div className='flex items-center gap-3 p-3 rounded-xl bg-orange-50/60'>
          <div>
            <p className='text-xs font-medium text-slate-800'>
              Anyone with this link
            </p>

            <p className='text-[11px] text-slate-500'>
              Can view and donwload this {item?.itemType === "folder" ? "folder" : "file"}
            </p>
          </div>
        </div>

        {/* Generated Link Box */}
        {isLoading ? (
          <div className='py-6 flex flex-col items-center justify-center gap-2 text-slate-500'>
            <Loader2Icon className='size-5 animate-spin text-orange-600' />
            <p className='text-xs font-medium'>Generating Sahre Link...</p>
          </div>
        ) : (
          generatedLink ? (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='block text-xs font-medium text-slate-700'>
                  Shareable Link
                </label>

                <div className='flex items-center gap-2'>
                  <Input
                    value={generatedLink}
                    readOnly
                    className="bg-slate-50 text-xs text-slate-700 select-all"
                  />

                  <Button variant="primary" className='shrink-0' onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <CheckIcon className="size-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="size-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Delete Share Link Option */}
              <div className='pt-2 border-t border-slate-100 text-slate-500 flex items-center justify-end gap-2'>
                <span className='text-xs'>Want to revoke access?</span>
                <XIcon onClick={handleDeleteShareLink} className="size-4 hover:text-red-600 cursor-pointer" />
              </div>

            </div>
          ) : (
            <div className='py-4 text-center'>
              <Button
                variant="primary"
                onClick={getOrCreateShareLink}
                isLoading={isLoading}
                className=''
              >
                Generate Share Link
              </Button>
            </div>
          )
        )}
      </div>
    </Modal>
  )
}

export default ShareModal