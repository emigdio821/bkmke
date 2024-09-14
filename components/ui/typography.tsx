interface TypographyProps {
  children: React.ReactNode
}

export function TypographyH3({ children }: TypographyProps) {
  return <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>
}

export function TypographyH4({ children }: TypographyProps) {
  return <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>
}

export function TypographyP({ children }: TypographyProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-2">{children}</p>
}

export function TypographyInlineCode({ children }: TypographyProps) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  )
}
