import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-full shadow bg-white dark:bg-gunmetal-600 text-primary2-700 dark:text-gunmetal-200 hover:bg-primary2-50 dark:hover:bg-gunmetal-500 transition-colors"
        >
            {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
    )
}
export default ThemeSwitch