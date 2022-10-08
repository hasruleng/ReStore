namespace API.RequestHelpers
{
    public class PaginationParams
    {
        private const int MaxPageSize =50; //page size tidak boleh lebih dari 50 produk (ga bakal kebaca juga)

        public int PageNumber { get; set; } = 1;

        private int _pageSize = 6;

        public int PageSize{
            get => _pageSize;
            set => _pageSize = value > MaxPageSize? MaxPageSize:value;
        }
    }
}