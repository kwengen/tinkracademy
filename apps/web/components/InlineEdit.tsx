'use client'

import { useState, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import DOMPurify from 'dompurify'

const sanitize = (html: string) =>
  typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html
import { useEditMode } from './EditModeContext'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface Props {
  table:     string
  id:        string
  field:     string
  value:     string | null | undefined
  multiline?: boolean
  tag?:      keyof JSX.IntrinsicElements
  className?: string
  style?:    React.CSSProperties
  label?:    string   // Vises øverst i editoren, f.eks. "Tittel" eller "Innhold"
}

/* CSS for rendered HTML output and TipTap editor content */
const EDITOR_STYLES = `
.rich-html ul, .tiptap-editor ul { list-style: disc; padding-left: 1.5em; margin: .25em 0; }
.rich-html ol, .tiptap-editor ol { list-style: decimal; padding-left: 1.5em; margin: .25em 0; }
.rich-html li, .tiptap-editor li { margin: .2em 0; }
.rich-html a,  .tiptap-editor a  { text-decoration: underline; cursor: pointer; }
.rich-html p,  .tiptap-editor p  { margin: 0; }
.tiptap-toolbar-btn:hover { background: #e2e8f0 !important; }
.tiptap-toolbar-btn-active { background: #dbeafe !important; color: #1d4ed8 !important; }
.tiptap-toolbar-btn-save:hover { background: #1d4ed8 !important; }
`

// ── Toolbar-knapp ─────────────────────────────────────────────────────────────

function TBtn({
  active, onClick, title, children,
}: {
  active?: boolean
  onClick: (e: React.MouseEvent) => void
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      className={`tiptap-toolbar-btn${active ? ' tiptap-toolbar-btn-active' : ''}`}
      onMouseDown={e => { e.preventDefault(); onClick(e) }}
      style={{
        padding: '.3rem .55rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '.8rem',
        fontWeight: 600,
        lineHeight: 1,
        background: active ? '#dbeafe' : 'transparent',
        color: active ? '#1d4ed8' : '#374151',
        transition: 'background .1s',
        display: 'flex',
        alignItems: 'center',
        gap: '.2rem',
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return (
    <span style={{ width: '1px', alignSelf: 'stretch', background: '#e2e8f0', margin: '0 .1rem' }} />
  )
}

// ── Rik tekst-editor ──────────────────────────────────────────────────────────

function RichEditor({
  initialValue, label, onSave, onCancel,
}: {
  initialValue: string
  label?:       string
  onSave:       (html: string) => void
  onCancel:     () => void
}) {
  const [linkMode, setLinkMode] = useState(false)
  const [linkUrl,  setLinkUrl]  = useState('')
  const linkInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', style: 'text-decoration:underline;cursor:pointer;' },
      }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        style: 'outline:none;min-height:4em;padding:.65rem .75rem;font-size:.9375rem;line-height:1.7;color:#1a2332;',
      },
    },
  })

  const applyLink = useCallback(() => {
    if (!editor || !linkUrl.trim()) return
    const href = linkUrl.startsWith('http') ? linkUrl.trim() : `https://${linkUrl.trim()}`
    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${href}">${href}</a>`).run()
    } else {
      editor.chain().focus().setLink({ href }).run()
    }
    setLinkMode(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  if (!editor) return null

  return (
    <>
      <style>{EDITOR_STYLES}</style>
      <div style={{
        border: '2px solid var(--clr-primary)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 0 0 3px rgba(20,97,168,.12)',
      }}>

        {/* ── Toppstripe med label + toolbar ───────────────────────────── */}
        <div style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}>

          {/* Label-rad */}
          {label && (
            <div style={{
              padding: '.3rem .75rem .25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '.4rem',
            }}>
              <span style={{
                fontSize: '.68rem',
                fontWeight: 800,
                color: 'var(--clr-primary)',
                textTransform: 'uppercase',
                letterSpacing: '.07em',
              }}>
                ✎ {label}
              </span>
            </div>
          )}

          {/* Verktøylinje */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '.1rem',
            padding: '.35rem .5rem',
          }}>

            {/* Formatering */}
            <TBtn active={editor.isActive('bold')} title="Fet (Ctrl+B)"
              onClick={() => editor.chain().focus().toggleBold().run()}>
              <strong style={{ fontFamily: 'serif', fontSize: '.9rem' }}>B</strong>
            </TBtn>
            <TBtn active={editor.isActive('italic')} title="Kursiv (Ctrl+I)"
              onClick={() => editor.chain().focus().toggleItalic().run()}>
              <em style={{ fontFamily: 'serif', fontSize: '.9rem' }}>I</em>
            </TBtn>

            <Divider />

            {/* Lister */}
            <TBtn active={editor.isActive('bulletList')} title="Punktliste"
              onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="2" cy="4" r="1.5"/><rect x="5" y="3" width="10" height="2" rx="1"/>
                <circle cx="2" cy="8" r="1.5"/><rect x="5" y="7" width="10" height="2" rx="1"/>
                <circle cx="2" cy="12" r="1.5"/><rect x="5" y="11" width="10" height="2" rx="1"/>
              </svg>
              <span style={{ fontSize: '.75rem' }}>Liste</span>
            </TBtn>
            <TBtn active={editor.isActive('orderedList')} title="Nummerert liste"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <text x="0" y="5" fontSize="5" fontWeight="bold">1.</text>
                <rect x="6" y="3" width="9" height="1.8" rx=".9"/>
                <text x="0" y="10" fontSize="5" fontWeight="bold">2.</text>
                <rect x="6" y="8" width="9" height="1.8" rx=".9"/>
                <text x="0" y="15" fontSize="5" fontWeight="bold">3.</text>
                <rect x="6" y="13" width="9" height="1.8" rx=".9"/>
              </svg>
              <span style={{ fontSize: '.75rem' }}>Numm.</span>
            </TBtn>

            <Divider />

            {/* Lenke */}
            {!linkMode ? (
              <TBtn active={editor.isActive('link')} title={editor.isActive('link') ? 'Fjern lenke' : 'Legg til lenke'}
                onClick={() => {
                  if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run()
                  } else {
                    setLinkMode(true)
                    setTimeout(() => linkInputRef.current?.focus(), 50)
                  }
                }}>
                <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"/>
                </svg>
                <span style={{ fontSize: '.75rem' }}>{editor.isActive('link') ? 'Fjern lenke' : 'Lenke'}</span>
              </TBtn>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                <input
                  ref={linkInputRef}
                  type="url"
                  value={linkUrl}
                  placeholder="https://…"
                  onChange={e => setLinkUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter')  { e.preventDefault(); applyLink() }
                    if (e.key === 'Escape') { setLinkMode(false); setLinkUrl('') }
                  }}
                  style={{
                    fontSize: '.8rem', padding: '.25rem .5rem',
                    border: '1px solid #cbd5e1', borderRadius: '5px',
                    background: 'white', color: '#1a2332',
                    outline: 'none', width: '180px',
                  }}
                />
                <TBtn onClick={applyLink}>OK</TBtn>
                <TBtn onClick={() => { setLinkMode(false); setLinkUrl('') }}>✕</TBtn>
              </span>
            )}

            {/* Spacer */}
            <span style={{ flex: 1 }} />

            {/* Lagre / Avbryt */}
            <button
              type="button"
              className="tiptap-toolbar-btn-save"
              onMouseDown={e => { e.preventDefault(); onSave(editor.getHTML()) }}
              style={{
                padding: '.3rem .85rem',
                background: 'var(--clr-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 700,
                fontSize: '.8rem',
                cursor: 'pointer',
                transition: 'background .1s',
              }}
            >
              Lagre
            </button>
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); onCancel() }}
              style={{
                padding: '.3rem .75rem',
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #e2e8f0',
                borderRadius: '5px',
                fontWeight: 600,
                fontSize: '.8rem',
                cursor: 'pointer',
              }}
            >
              Avbryt
            </button>
          </div>
        </div>

        {/* ── Innhold ──────────────────────────────────────────────────── */}
        <EditorContent editor={editor} />
      </div>
    </>
  )
}

// ── InlineEdit ────────────────────────────────────────────────────────────────

export function InlineEdit({
  table, id, field, value, multiline, tag = 'span', className, style, label,
}: Props) {
  const Tag    = tag as React.ElementType
  const { isEditMode } = useEditMode()
  const { role }       = useAuth()
  const isAdmin  = role === 'admin' || role === 'superadmin'
  const isStatic = id.startsWith('static')

  const [editing,    setEditing]    = useState(false)
  const [localValue, setLocalValue] = useState(value ?? '')
  const [saving,     setSaving]     = useState(false)

  const text   = localValue || ''
  const isHtml = text.startsWith('<')
  const OuterTag = (isHtml ? 'div' : Tag) as React.ElementType

  // Fallback label: capitaliser felt-navn
  const displayLabel = label ?? (field.charAt(0).toUpperCase() + field.slice(1))

  async function save(newVal: string) {
    setSaving(true)
    const clean = sanitize(newVal)
    await supabase.from(table).update({ [field]: clean || null }).eq('id', id)
    setLocalValue(clean)
    setSaving(false)
    setEditing(false)
  }

  const rendered = isHtml
    ? <>
        <style>{EDITOR_STYLES}</style>
        <span className="rich-html" dangerouslySetInnerHTML={{ __html: sanitize(text) }} />
      </>
    : <>{text}</>

  /* Normal view */
  if (!isEditMode || !isAdmin) {
    return <OuterTag className={className} style={style}>{rendered}</OuterTag>
  }

  /* Seed/static content */
  if (isStatic) {
    return (
      <OuterTag className={className}
        style={{ ...style, outline: '1px dashed #ccc', borderRadius: '2px', cursor: 'not-allowed' }}
        title="Seed innhold i admin-panelet for å aktivere redigering">
        {rendered}
      </OuterTag>
    )
  }

  /* Editing – multiline med rik editor */
  if (editing && multiline) {
    return (
      <div style={{ opacity: saving ? .6 : 1 }}>
        <RichEditor
          initialValue={text}
          label={displayLabel}
          onSave={save}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  /* Editing – enkeltlinje */
  if (editing) {
    return (
      <>
        <style>{EDITOR_STYLES}</style>
        <span style={{
          display: 'block',
          fontSize: '.68rem', fontWeight: 800,
          color: 'var(--clr-primary)', textTransform: 'uppercase',
          letterSpacing: '.07em', marginBottom: '.2rem',
        }}>
          ✎ {displayLabel}
        </span>
        <span
          contentEditable suppressContentEditableWarning autoFocus
          style={{
            display: 'inline-block', minWidth: '4rem', padding: '.3rem .5rem',
            border: '2px solid var(--clr-primary)', borderRadius: '6px',
            outline: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 0 0 3px rgba(20,97,168,.12)',
            opacity: saving ? .6 : 1,
            background: 'white',
          }}
          onBlur={e => save(e.currentTarget.innerText.trim())}
          onKeyDown={e => {
            if (e.key === 'Enter')  { e.preventDefault(); (e.target as HTMLElement).blur() }
            if (e.key === 'Escape') setEditing(false)
          }}
        >
          {text}
        </span>
      </>
    )
  }

  /* Edit mode – ikke klikket ennå */
  return (
    <OuterTag
      className={className}
      style={{
        ...style,
        cursor: 'text',
        outline: '1.5px dashed var(--clr-primary)',
        borderRadius: '3px',
        padding: '0 3px',
        position: 'relative',
        display: isHtml ? 'block' : 'inline-block',
        minWidth: '2rem',
      }}
      onClick={() => setEditing(true)}
      title={`Klikk for å redigere: ${displayLabel}`}
    >
      {text ? rendered : <em style={{ opacity: .35 }}>Tom felt</em>}
      <span aria-hidden="true" style={{
        position: 'absolute', top: '-7px', right: '-7px',
        background: 'var(--clr-primary)', color: 'white',
        borderRadius: '50%', width: '14px', height: '14px', fontSize: '9px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>✎</span>
    </OuterTag>
  )
}
