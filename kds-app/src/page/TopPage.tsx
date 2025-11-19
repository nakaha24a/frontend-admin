
import { useNavigate } from 'react-router-dom';
import {type KitchenOrder,fetchKitchenOrders} from '../api/backendapi.tsx';
import './TopPage.css';

function TopPage() {
   
  const navigate = useNavigate();

  return (
    <><div className="top-page" >
          <h1 className="top-h1">飲食店注文管理システム</h1>
          <div className="button-container" >
              <button className="button"
                 
                  onClick={() => navigate("/orders")}
              >
                  注文受取画面
              </button>
              <button className="button"
                  
                  onClick={() => navigate("/menu")}
              >
                  メニュー編集画面
              </button>
          </div>
          <footer className="top-footer">
            &copy; 2025 飲食店管理システム
          </footer>
      </div></>
  );
   

}

export default TopPage;

  

async function loadAndDisplayKitchenOrders() {
    const listContainer = document.getElementById('kitchen-order-list');
    if (!listContainer) return; // 表示する要素がない場合は終了

    listContainer.innerHTML = '<li>読み込み中...</li>'; // ロード表示

    try {
        // ① API関数を呼び出し、サーバーから非同期でデータを取得
        // 戻り値は KitchenOrder[] 型として受け取る
        const orders: KitchenOrder[] = await fetchKitchenOrders();

        // ② 取得したデータを処理・利用
        console.log('取得した注文データ:', orders);

        if (orders.length === 0) {
            listContainer.innerHTML = '<li>現在、調理中の注文はありません。</li>';
            return;
        }
        
        // ③ データをHTMLに整形して表示（例）
        const htmlContent = orders.map(order => {
            return `
                <li data-order-id="${order.id}">
                    **卓番号: ${order.tableNumber}** / 状態: ${order.status}
                    <br>注文時刻: ${new Date(order.timestamp).toLocaleTimeString()}
                </li>
            `;
        }).join('');
        
        listContainer.innerHTML = htmlContent;

    } catch (error) {
        // ④ エラー処理
        console.error('注文リストの取得中にエラーが発生しました:', error);
        listContainer.innerHTML = '<li>データの取得に失敗しました。サーバーを確認してください。</li>';
    }
}

// ページ読み込み完了時やボタンクリック時などに実行
loadAndDisplayKitchenOrders();
