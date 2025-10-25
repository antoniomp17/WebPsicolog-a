import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, User } from "lucide-react";
import { articles } from "@/lib/data";

export default function Blog() {
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-marron mb-4" data-testid="text-blog-title">
          Artículos y Recursos
        </h1>
        <p className="text-lg text-gris-medio max-w-3xl mx-auto" data-testid="text-blog-subtitle">
          Explora nuestros artículos sobre psicología, bienestar emocional y desarrollo personal
        </p>
      </section>

      {/* Articles Grid */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="overflow-hidden shadow-lg border-card-border hover-elevate transition-all"
            data-testid={`card-article-${article.id}`}
          >
            <div className="md:flex">
              <img
                src={article.image}
                alt={article.title}
                className="w-full md:w-64 h-48 object-cover"
                data-testid={`img-article-${article.id}`}
              />
              <div className="flex-1">
                <CardHeader>
                  <div className="flex flex-wrap gap-4 text-sm text-gris-medio mb-3">
                    <span className="flex items-center gap-1" data-testid={`text-article-date-${article.id}`}>
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1" data-testid={`text-article-author-${article.id}`}>
                      <User className="w-4 h-4" />
                      {article.author}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-marron mb-3" data-testid={`text-article-title-${article.id}`}>
                    {article.title}
                  </h2>
                  <p className="text-gris-medio mb-4" data-testid={`text-article-excerpt-${article.id}`}>
                    {article.excerpt}
                  </p>
                  <Button
                    onClick={() => setSelectedArticle(article)}
                    variant="secondary"
                    className="hover-elevate active-elevate-2"
                    data-testid={`button-read-${article.id}`}
                  >
                    Leer más
                  </Button>
                </CardHeader>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Article Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="dialog-article">
          <DialogHeader>
            <div className="flex flex-wrap gap-4 text-sm text-gris-medio mb-3">
              <span className="flex items-center gap-1" data-testid="text-modal-article-date">
                <Calendar className="w-4 h-4" />
                {selectedArticle?.date}
              </span>
              <span className="flex items-center gap-1" data-testid="text-modal-article-author">
                <User className="w-4 h-4" />
                {selectedArticle?.author}
              </span>
            </div>
            <DialogTitle className="text-3xl text-marron mb-4" data-testid="text-modal-article-title">
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedArticle && (
            <div className="space-y-4">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-lg"
                data-testid="img-modal-article"
              />
              <div
                className="prose prose-lg max-w-none text-gris-medio"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                data-testid="content-modal-article"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
