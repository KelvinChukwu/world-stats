import { LoginForm } from "@/components/login-form";
import { WorldStatsNav } from "../world-stats-nav";


export default function Page() {
    return (
        <div>
            <WorldStatsNav />
            <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">

                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </main>
        </div>
    )
}
