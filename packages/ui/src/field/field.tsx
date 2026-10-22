import { Field as BaseField } from '@base-ui/react/field'
import type { ReactNode } from 'react'

export interface FieldProps {
  label: ReactNode
  /** 填写说明，放在控件下方 */
  description?: ReactNode
  /**
   * 错误信息，写“发生了什么，加上怎么办”（DESIGN.md §8）。不传时，放在 Form 里的 Field 显示 Form 的 errors 里
   * 同名字段的错误，或者浏览器约束校验（type="email"……）的提示
   */
  error?: ReactNode
  /**
   * 控件没填就提交时的提示（ValidityState 的 valueMissing）。不传时显示浏览器生成的消息，
   * 它跟随浏览器的语言而不是站点：站点是双语，浏览器语言可能和站点不一致，所以必填的提示由站点设定
   */
  requiredError?: string
  disabled?: boolean
  name?: string
  /**
   * 控件是一个按钮（例如 Select）时设为 false：标签渲染成 div，点标签只聚焦控件，不会像原生 label 那样把点击转给按钮
   * （Base UI 的 nativeLabel）
   */
  nativeLabel?: boolean
  /** 一个表单控件，例如 Input */
  children: ReactNode
}

const errorClass = 'text-sm text-danger'

/** 包裹表单控件，统一标签、说明和错误信息的位置，并把它们和控件关联起来（aria-describedby） */
export function Field({
  label,
  description,
  error,
  requiredError,
  disabled,
  name,
  nativeLabel = true,
  children,
}: FieldProps) {
  return (
    <BaseField.Root
      name={name}
      disabled={disabled}
      // 有错误时强制无效；没有时交给 Form 和浏览器的约束校验
      invalid={error ? true : undefined}
      // requiredError 用自定义校验接管浏览器的 valueMissing 消息：空值时返回站点文案（customError
      // 优先于浏览器生成的消息），填了返回 null 不拦截其他约束（type="email" 格式错照常）
      validate={
        requiredError !== undefined
          ? (value) => (value === '' || value == null ? requiredError : null)
          : undefined
      }
      className="flex flex-col gap-2"
    >
      <BaseField.Label
        className="text-sm font-medium text-text data-disabled:text-text-muted"
        nativeLabel={nativeLabel}
        render={nativeLabel ? undefined : <div />}
      >
        {label}
      </BaseField.Label>
      {children}
      {description && <BaseField.Description className="text-sm text-text-muted">{description}</BaseField.Description>}
      // 不能传 children（哪怕是 undefined），否则不显示 Form 和浏览器给的错误信息。
      // requiredError 存在时，validate 返回的站点文案从这里显示，浏览器消息不再出现
      {error ? (
        <BaseField.Error match className={errorClass}>
          {error}
        </BaseField.Error>
      ) : (
        <BaseField.Error className={errorClass} />
      )}
    </BaseField.Root>
  )
}
