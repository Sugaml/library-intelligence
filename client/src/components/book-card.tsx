import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
import { Book } from "@shared/schema";

interface BookCardProps {
  book: Book;
  onBorrow?: (book: Book) => void;
  onView?: (book: Book) => void;
  onRequest?: (book: Book) => void;
  showActions?: boolean;
}

const programColors = {
  MBA: "tu-bg-blue bg-opacity-10 tu-text-blue",
  MBAIT: "tu-bg-green bg-opacity-10 tu-text-green",
  MBAFC: "tu-bg-amber bg-opacity-10 tu-text-amber",
  "MBA GLM": "bg-purple-100 text-purple-600",
};

export default function BookCard({ 
  book, 
  onBorrow, 
  onView, 
  onRequest,
  showActions = true 
}: BookCardProps) {
  const isAvailable = book.availableCopies > 0;
  const programColorClass = programColors[book.program as keyof typeof programColors] || "bg-gray-100 text-gray-600";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <img 
        src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400"} 
        alt={`${book.title} cover`}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={`text-xs font-medium ${programColorClass}`}>
            {book.program}
          </Badge>
          <span className={`text-xs ${isAvailable ? 'text-gray-500' : 'text-red-500'}`}>
            Available: {book.availableCopies}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
        <p className="text-xs text-gray-500 mb-3">ISBN: {book.isbn}</p>
        
        {showActions && (
          <div className="flex space-x-2">
            {isAvailable ? (
              <Button 
                onClick={() => onBorrow?.(book)}
                className="flex-1 tu-bg-blue text-white hover:bg-blue-700 text-sm"
              >
                Borrow
              </Button>
            ) : (
              <Button 
                onClick={() => onRequest?.(book)}
                className="flex-1 bg-gray-400 text-white cursor-not-allowed text-sm"
                disabled
              >
                Out of Stock
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(book)}
              className="px-3"
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="px-3"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
