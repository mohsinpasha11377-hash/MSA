type MsaLogoProps = {
  className?: string
  compact?: boolean
}

/** MSA Interior and Exterior brand mark */
export function MsaLogo({ className = '', compact = false }: MsaLogoProps) {
  return (
    <img
      className={`msa-logo${compact ? ' msa-logo-compact' : ''} ${className}`.trim()}
      src={`${import.meta.env.BASE_URL}msa-logo.png`}
      alt="MSA Interior and Exterior"
      width={compact ? 72 : 140}
      height={compact ? 108 : 210}
    />
  )
}
