import axios from 'axios';
import {useState} from 'react';


const BASE_URL=import.meta.env.VITE_BASE_URL;
const API_PATH=import.meta.env.VITE_API_PATH;

function App() {
// isAuth：用於存儲使用者的登入狀態。
// tempProduct：存儲目前選中的單一產品細節。
// products：存儲從後端獲取的產品清單。
// account：存儲使用者登入的帳號與密碼。
  const [isAuth,setIsAuth]=useState(false);
  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts]=useState([]);
  const [account,setAccount]=useState({
  username: "example@test.com",
  password: "example"
  })

  const handleInputChange=(e)=>{
    const {value,name}=e.target;
    setAccount({
      ...account,
      // 根據輸入框的 name 屬性（如 username 或 password），動態更新對應的屬性值。
      // 輸入框的 name="username"，則更新 account.username = value。
      // name="password"，則更新 account.password = value。
      [name]:value
    })
  }
  // promise寫法
  // Promise 寫法更適合處理多個 then 的連續鏈式操作。
  // const handleLogin=(e)=>{
  //   // 取消預設事件，使輸入密碼後可按enter登入
  //   e.preventDefault();
  //   axios.post(`${BASE_URL}/admin/signin`,account)
  //     .then((res)=>{
  //       const {token,expired}=res.data;
  //       console.log(token,expired);
  //       document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
  //       axios.defaults.headers.common['Authorization'] = token;
  //       axios.get(`${BASE_URL}/api/${API_PATH}/admin/products`)
  //         .then((res)=>setProducts(res.data.products))
  //         .catch((error)=> console.log(error));
  //       setIsAuth(true);
  //     })
  //     .catch((error)=>alert('登入失敗'));
  // }

  // async await寫法

  const getData=async()=>{
    try {
      const res=await axios.get(`${BASE_URL}/api/${API_PATH}/admin/products`);
          setProducts(res.data.products);
        } catch (error) {
          console.error(error);
    }
  }
  
  const handleLogin=async(e)=>{
    // 取消預設事件，使輸入密碼後可按enter登入
    e.preventDefault();
    try {
      const res=await axios.post(`${BASE_URL}/admin/signin`,account)
        const {token,expired}=res.data;
        // 儲存 Token
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        axios.defaults.headers.common['Authorization'] = token;
        getData();
        setIsAuth(true);
    } catch (error) {
      alert('登入失敗')
    }
  }


  const checkUserLogin =async()=>{
    try {
      await axios.post(`${BASE_URL}/api/user/check`)
      alert('使用者已登入')
    } catch (error) {
      console.log('使用者未登入')
    }
  }
  
  return(
  <>
  {/* 如果 isAuth 為 true，則渲染產品列表頁面。 */}
  {/* 如果 isAuth 為 false，則渲染登入表單。 */}
    {isAuth ? <div className="container py-5">
      <div className="row">
        <div className="col-6">
          <button onClick={checkUserLogin}  className='btn btn-success mb-5' type="button">檢查使用者是否登入</button>
          <h2>產品列表</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.title}</th>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled}</td>
                  <td>
                    <button
                      onClick={() => setTempProduct(product)}
                      className="btn btn-primary"
                      type="button"
                    >
                      查看細節
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-6">
          <h2>單一產品細節</h2>
          {tempProduct.title ? (
            <div className="card">
              <img
                src={tempProduct.imageUrl}
                className="card-img-top img-fluid"
                alt={tempProduct.title}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {tempProduct.title}
                  <span className="badge text-bg-primary">
                    {tempProduct.category}
                  </span>
                </h5>
                <p className="card-text">商品描述：{tempProduct.description}</p>
                <p className="card-text">商品內容：{tempProduct.content}</p>
                <p className="card-text">
                  <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                  元
                </p>
                <h5 className="card-title">更多圖片：</h5>
                {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="img-fluid" />)))}
              </div>
            </div>
          ) : (
            <p>請選擇一個商品查看</p>
          )}
        </div>
      </div>
    </div> :     <div className="d-flex flex-column justify-content-center align-items-center vh-100">
    <h1 className="mb-5">請先登入</h1>
    {/* form表單搭配submit的按鈕，常見用法 */}
    <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
    <div className="form-floating mb-3">
      <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
      <label htmlFor="username">Email address</label>
    </div>
    <div className="form-floating">
      <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
      <label htmlFor="password">Password</label>
    </div>
    <button className="btn btn-primary">登入</button>
  </form>
  <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
</div>}
</>
  )
}

export default App
