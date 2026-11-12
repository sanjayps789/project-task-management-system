const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-3 text-sm font-medium text-gray-500">{text}</p>
        </div>
    );
};

export default Loader;