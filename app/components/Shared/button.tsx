import { cva, type VariantProps } from "cva"

const styles = cva({
    base: "rounded border font-semibold",
    variants: {
        intent: {
            primary: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
            secondary: "border-gray-400 bg-white text-gray-800 hover:bg-gray-100",
        },
        size: {
            small: "px-2 py-1 text-sm",
            medium: "px-4 py-4 text-base",
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "medium",
    },
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof styles>

export const Button: React.FC<ButtonProps> = ({
    className,
    intent,
    size,
    ...props
}) => {
    return <button className={styles({ intent, size, className })} {...props} />
}
