import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface AlertDialogProps {
    css: string
    id: string
    text?: string
    title: string
    data: string
    onConfirm: () => void
}

export function DeleteAlert({ id, text, onConfirm, css, title, data }: AlertDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className={css} title={title}>
                    {text ? (<span>{text}</span>) : (<Trash2 className="w-4 h-4" />)}

                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure? {id}</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.<br>
                        </br>
                        You are deleteing <strong>{data}</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
