import { LoaderPinwheelIcon as Spinner } from 'lucide-react'

export default function Loading() {
 return (
     <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
       <Spinner className="w-10 h-10 animate-spin text-primary" />
       <p className="mt-4 text-lg font-medium text-muted-foreground">Loading...</p>
      </div>
     </div>
 )
}