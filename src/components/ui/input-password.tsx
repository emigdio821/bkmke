import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { InputProps } from './input'
import { Button } from './button'

export function InputPassword(props: InputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput
        type={showPassword ? 'text' : 'password'}
        aria-label="Password input with show/hide toggle"
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger
            closeOnClick={false}
            render={
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => {
                  setShowPassword((prev) => !prev)
                }}
              />
            }
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </TooltipTrigger>
          <TooltipContent>{showPassword ? 'Hide password' : 'Show password'}</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  )
}
