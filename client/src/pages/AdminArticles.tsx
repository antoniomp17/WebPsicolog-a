import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, FileText, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertArticleSchema, type InsertArticle } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  imageUrl: string;
  publishedAt: string;
  viewsCount: number;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminArticles() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/admin/articles"],
    enabled: user?.role === "admin",
  });

  const form = useForm<InsertArticle>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      authorName: "",
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
      publishedAt: new Date(),
      viewsCount: 0,
      isPublished: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      return apiRequest("POST", "/api/admin/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Artículo creado",
        description: "El artículo ha sido creado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el artículo",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertArticle> }) => {
      return apiRequest("PUT", `/api/admin/articles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setIsEditDialogOpen(false);
      setSelectedArticle(null);
      form.reset();
      toast({
        title: "Artículo actualizado",
        description: "El artículo ha sido actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el artículo",
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async ({ articleId, isPublished }: { articleId: string; isPublished: boolean }) => {
      return apiRequest("PATCH", `/api/admin/articles/${articleId}/publish`, { isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({
        title: "Artículo actualizado",
        description: "El estado de publicación ha sido actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el artículo",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (articleId: string) => {
      return apiRequest("DELETE", `/api/admin/articles/${articleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setIsDeleteDialogOpen(false);
      setSelectedArticle(null);
      toast({
        title: "Artículo eliminado",
        description: "El artículo ha sido eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el artículo",
        variant: "destructive",
      });
    },
  });

  const handleOpenCreate = () => {
    form.reset({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      authorName: user?.name || "",
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
      publishedAt: new Date(),
      viewsCount: 0,
      isPublished: false,
    });
    setIsCreateDialogOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setSelectedArticle(article);
    form.reset({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      authorName: article.authorName,
      imageUrl: article.imageUrl,
      publishedAt: new Date(article.publishedAt),
      viewsCount: article.viewsCount,
      isPublished: article.isPublished,
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDelete = (article: Article) => {
    setSelectedArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const onSubmitCreate = (data: InsertArticle) => {
    createMutation.mutate(data);
  };

  const onSubmitEdit = (data: InsertArticle) => {
    if (selectedArticle) {
      updateMutation.mutate({ id: selectedArticle.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedArticle) {
      deleteMutation.mutate(selectedArticle.id);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-dorado border-t-transparent"></div>
          <p className="mt-4 text-gris-medio">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  const publishedCount = articles.filter(a => a.isPublished).length;
  const totalViews = articles.reduce((sum, a) => sum + a.viewsCount, 0);

  return (
    <div className="min-h-screen bg-crema dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-marron dark:text-white" data-testid="text-articles-title">
              Gestión de Artículos
            </h1>
            <Button onClick={handleOpenCreate} data-testid="button-create-article">
              <Plus className="h-4 w-4 mr-2" />
              Crear Artículo
            </Button>
          </div>
          <p className="text-gris-medio dark:text-gray-400">
            Total: {articles.length} • Publicados: {publishedCount} • Vistas: {totalViews}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {articles.map((article) => (
            <Card key={article.id} className="hover-elevate" data-testid={`card-article-${article.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full lg:w-48 h-32 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-marron dark:text-white mb-1" data-testid={`text-article-title-${article.id}`}>
                          {article.title}
                        </h3>
                        <p className="text-sm text-gris-medio dark:text-gray-400 line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {article.isPublished ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Publicado
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                            Borrador
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gris-medio">Autor:</span>
                        <span className="ml-1 font-semibold text-marron dark:text-white">{article.authorName}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gris-medio">Vistas:</span>
                        <span className="ml-1 font-semibold text-marron dark:text-white">{article.viewsCount}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gris-medio">Publicado:</span>
                        <span className="ml-1 font-semibold text-marron dark:text-white">
                          {new Date(article.publishedAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="text-sm text-gris-claro dark:text-gray-500">
                        Creado: {new Date(article.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={article.isPublished ? "outline" : "default"}
                        size="sm"
                        onClick={() => publishMutation.mutate({ articleId: article.id, isPublished: !article.isPublished })}
                        disabled={publishMutation.isPending}
                        data-testid={`button-publish-${article.id}`}
                      >
                        {article.isPublished ? "Despublicar" : "Publicar"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenEdit(article)}
                        data-testid={`button-edit-${article.id}`}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenDelete(article)}
                        data-testid={`button-delete-${article.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gris-medio">No hay artículos disponibles</p>
              <Button onClick={handleOpenCreate} className="mt-4" data-testid="button-create-first-article">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Artículo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Artículo</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-article-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ejemplo: mindfulness-diario" data-testid="input-article-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extracto</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} data-testid="input-article-excerpt" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido (HTML)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={8} data-testid="input-article-content" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-article-author" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de publicación</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          data-testid="input-article-date" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de imagen</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." data-testid="input-article-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publicar</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Hacer visible en el blog
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-article-published"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} data-testid="button-cancel-create">
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-create">
                  {createMutation.isPending ? "Creando..." : "Crear Artículo"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Artículo</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extracto</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} data-testid="input-edit-excerpt" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido (HTML)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={8} data-testid="input-edit-content" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-author" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de publicación</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date"
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          data-testid="input-edit-date" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de imagen</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publicar</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Hacer visible en el blog
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-edit-published"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} data-testid="button-cancel-edit">
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending} data-testid="button-submit-edit">
                  {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El artículo "{selectedArticle?.title}" será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} data-testid="button-confirm-delete">
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
