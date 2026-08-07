import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VendingMachine from './components/VendingMachine';
import ReceiptCard from './components/ReceiptCard';
import InfiniteLoopTags from './components/InfiniteLoopTags';
import MyArchive from './components/MyArchive';
import AladinBookSearch from './components/AladinBookSearch';
import { blendHashtagsAndPrescribe } from './utils/aiBlendingEngine';
import {
  fetchPrescriptionFromApi,
  fetchMyReceiptsFromApi,
  saveReceiptToApi,
  deleteReceiptFromApi
} from './api/readTagApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('vending'); // 'vending', 'search', 'receipt', 'archive'
  const [selectedTags, setSelectedTags] = useState(['#도파민', '#세계문학전집', '#오답노트']);
  const [prescription, setPrescription] = useState(null);
  const [archiveList, setArchiveList] = useState([]);

  // Load receipts from backend API on mount
  useEffect(() => {
    async function loadBackendArchive() {
      const serverReceipts = await fetchMyReceiptsFromApi();
      if (serverReceipts && serverReceipts.length > 0) {
        const mapped = serverReceipts.map(r => ({
          id: r.id ? String(r.id) : r.receiptNo,
          date: r.createdAt ? new Date(r.createdAt).toLocaleString('ko-KR') : new Date().toLocaleString('ko-KR'),
          book: r.book,
          selectedTags: r.selectedTags || [],
          review: {
            text: r.reviewText || '',
            quote: r.quote || '',
            stickers: r.stickers || [],
            userName: r.userName || '독서가'
          }
        }));
        setArchiveList(mapped);
      }
    }
    loadBackendArchive();
  }, []);

  const handleDispense = async (tagsToBlend) => {
    const apiResult = await fetchPrescriptionFromApi(tagsToBlend);
    if (apiResult && apiResult.primaryBook) {
      setPrescription({
        primaryBook: apiResult.primaryBook,
        secondaryBooks: apiResult.secondaryBooks || [],
        derivativeTags: apiResult.derivativeTags || []
      });
    } else {
      const localResult = blendHashtagsAndPrescribe(tagsToBlend);
      setPrescription(localResult);
    }
    setActiveTab('receipt');
  };

  const handleSelectBookFromSearch = (selectedBook) => {
    const bookTags = selectedBook.primaryTags && selectedBook.primaryTags.length > 0 
      ? selectedBook.primaryTags 
      : ['#알라딘실시간', '#독서영수증', '#텍스트힙'];

    setSelectedTags(bookTags);
    setPrescription({
      primaryBook: selectedBook,
      secondaryBooks: [],
      derivativeTags: selectedBook.derivativeTags && selectedBook.derivativeTags.length > 0 
        ? selectedBook.derivativeTags 
        : ['#알라딘OpenAPI', '#실시간도서', '#몰입의즐거움']
    });
    setActiveTab('receipt');
  };

  const handleSelectDerivativeTag = (tag) => {
    let newTags;
    if (selectedTags.length < 3) {
      newTags = [...selectedTags, tag];
    } else {
      newTags = [selectedTags[1], selectedTags[2], tag];
    }
    setSelectedTags(newTags);
    handleDispense(newTags);
  };

  const handleSaveToArchive = async (archiveItem) => {
    await saveReceiptToApi(archiveItem);

    setArchiveList(prev => {
      const exists = prev.some(item => item.id === archiveItem.id);
      if (exists) return prev;
      return [archiveItem, ...prev];
    });
  };

  const handleDeleteArchiveItem = async (id) => {
    if (typeof id === 'number' || !isNaN(Number(id))) {
      await deleteReceiptFromApi(id);
    }
    setArchiveList(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectArchiveItem = (archiveItem) => {
    setSelectedTags(archiveItem.selectedTags || []);
    setPrescription({
      primaryBook: archiveItem.book,
      secondaryBooks: [],
      derivativeTags: archiveItem.book?.derivativeTags || []
    });
    setActiveTab('receipt');
  };

  const isCurrentPrescriptionSaved = archiveList.some(
    item => item.book?.id === prescription?.primaryBook?.id
  );

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        archiveCount={archiveList.length}
      />

      {/* Main Content Viewport */}
      <main className="main-content">
        {activeTab === 'vending' && (
          <VendingMachine
            onDispense={handleDispense}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        )}

        {activeTab === 'search' && (
          <AladinBookSearch
            onSelectBookForReceipt={handleSelectBookFromSearch}
          />
        )}

        {activeTab === 'receipt' && (
          <div className="receipt-view-wrapper">
            {prescription ? (
              <>
                <ReceiptCard
                  prescription={prescription}
                  selectedTags={selectedTags}
                  onSaveToArchive={handleSaveToArchive}
                  isSavedInArchive={isCurrentPrescriptionSaved}
                  onSelectDerivativeTag={handleSelectDerivativeTag}
                />

                {/* Step 3: Infinite Loop Derivative Tags */}
                <InfiniteLoopTags
                  derivativeTags={prescription?.derivativeTags}
                  onSelectDerivativeTag={handleSelectDerivativeTag}
                />
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <p>알라딘 OpenAPI에서 추천 도서를 가져오고 있습니다...</p>
                <button
                  onClick={() => handleDispense(selectedTags)}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#6366f1',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  실시간 도서 처방받기
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'archive' && (
          <MyArchive
            archiveList={archiveList}
            onDeleteItem={handleDeleteArchiveItem}
            onSelectArchiveItem={handleSelectArchiveItem}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 ReadTag — MZ세대를 위한 AI 해시태그 독서 자판기 & Proof of Reading 플랫폼</p>
      </footer>
    </div>
  );
}
