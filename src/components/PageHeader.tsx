type PageHeaderProps = {
  title: string;
  highlight?: string;
  description: string;
};

const PageHeader = ({ title, highlight, description }: PageHeaderProps) => (
  <div className="border-b border-border bg-muted/30 py-14 md:py-16">
    <div className="container mx-auto max-w-3xl text-center">
      <h1 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-accent">{highlight}</span>
          </>
        )}
      </h1>
      <p className="text-muted-foreground md:text-lg">{description}</p>
    </div>
  </div>
);

export default PageHeader;
