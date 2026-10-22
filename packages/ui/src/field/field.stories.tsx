import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { Input } from '../input/input.tsx'
import { Form } from '../form/form.tsx'
import { Field } from './field.tsx'

const meta = {
  title: 'Components/Field',
  component: Field,
  args: { label: '邮箱', children: null },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field label="邮箱" description="用于登录和找回密码，不会公开">
      <Input type="email" name="email" autoComplete="email" placeholder="you@example.com" />
    </Field>
  ),
  play: async ({ canvas }) => {
    // 点标签聚焦输入框；说明文字经 aria-describedby 关联
    await userEvent.click(canvas.getByText('邮箱'))
    const input = canvas.getByRole('textbox', { name: '邮箱' })
    await expect(input).toHaveFocus()
    await expect(input).toHaveAccessibleDescription('用于登录和找回密码，不会公开')
    input.blur()
  },
}

export const WithError: Story = {
  render: () => (
    <Field label="角色名" error="这个角色名已被占用，换一个试试">
      <Input name="player" defaultValue="Notch" />
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: '角色名' })
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('这个角色名已被占用，换一个试试')
  },
}

export const RequiredError: Story = {
  render: () => (
    // 校验时机默认是表单提交，用 Form 包裹才能触发；必填没填时的提示由站点设定，
    // 不显示浏览器生成的消息（它跟随浏览器语言）
    <Form onSubmit={(e) => e.preventDefault()}>
      <Field label="邮箱" requiredError="请填写这一项。">
        <Input type="email" name="email" required placeholder="you@example.com" />
      </Field>
    </Form>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: '邮箱' })
    // 没填就提交（Enter 触发表单校验），站点传入的 requiredError 显示在 Field 下方
    await userEvent.click(input)
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText('请填写这一项。')).toBeInTheDocument()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    input.blur()
  },
}

export const Disabled: Story = {
  render: () => (
    <Field label="用户名" description="注册后不能修改" disabled>
      <Input name="username" defaultValue="steve" />
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: '用户名' })).toBeDisabled()
  },
}
