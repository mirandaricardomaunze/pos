const Footer: React.FC = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <>
      
      <footer className="bg-blue-500 text-white py-4 fixed  bottom-0 w-full">
        <div className="container mx-auto text-center">
          &copy; {year} POS System. All rights reserved.
        </div>
      </footer>
    </>
  );
}
export default Footer;