import React from 'react';
import { useParams } from 'react-router-dom';
import { modules } from '../data/modules';

import STLContainers from '../components/Content/Theory/STLContainers';
import SlidingWindowContent from '../components/Content/Interactive/SlidingWindowContent';
import IntroContent from '../components/Content/Theory/IntroContent';
import MemoryManagement from '../components/Content/Theory/MemoryManagement';
import TwoPointersContent from '../components/Content/Interactive/TwoPointersContent';
import PointersContent from '../components/Content/Interactive/PointersContent';
import ArraysContent from '../components/Content/Interactive/ArraysContent';
import LinkedListContent from '../components/Content/Interactive/LinkedListContent';
import StacksQueuesContent from '../components/Content/Interactive/StacksQueuesContent';
import TreesContent from '../components/Content/Interactive/TreesContent';
import HeapsContent from '../components/Content/Interactive/HeapsContent';
import TriesContent from '../components/Content/Interactive/TriesContent';
import SetsMapsContent from '../components/Content/Interactive/SetsMapsContent';
import GraphsContent from '../components/Content/Interactive/GraphsContent';
import RecursionContent from '../components/Content/Interactive/RecursionContent';
import FastSlowPointersContent from '../components/Content/Interactive/FastSlowPointersContent';

import CyclicSortContent from '../components/Content/Interactive/CyclicSortContent';
import InPlaceReversalContent from '../components/Content/Interactive/InPlaceReversalContent';
import TreeBFSDFSContent from '../components/Content/Interactive/TreeBFSDFSContent';
import TwoHeapsContent from '../components/Content/Interactive/TwoHeapsContent';
import SubsetsContent from '../components/Content/Interactive/SubsetsContent';
import ModifiedBinarySearchContent from '../components/Content/Interactive/ModifiedBinarySearchContent';
import BitwiseXORContent from '../components/Content/Interactive/BitwiseXORContent';
import TopKElementsContent from '../components/Content/Interactive/TopKElementsContent';
import KWayMergeContent from '../components/Content/Interactive/KWayMergeContent';
import TopologicalSortContent from '../components/Content/Interactive/TopologicalSortContent';
import DPContent from '../components/Content/Interactive/DPContent';
import GreedyContent from '../components/Content/Interactive/GreedyContent';
import UnionFindContent from '../components/Content/Interactive/UnionFindContent';
import MonotonicStackContent from '../components/Content/Interactive/MonotonicStackContent';
import DijkstraContent from '../components/Content/Interactive/DijkstraContent';
import TwoSumContent from '../components/Content/Blind75/TwoSumContent';
import StockContent from '../components/Content/Blind75/StockContent';
import ContainsDuplicateContent from '../components/Content/Blind75/ContainsDuplicateContent';
import ProductExceptSelfContent from '../components/Content/Blind75/ProductExceptSelfContent';
import MaxSubarrayContent from '../components/Content/Blind75/MaxSubarrayContent';
import MaxProductSubarrayContent from '../components/Content/Blind75/MaxProductSubarrayContent';
import FindMinRotatedContent from '../components/Content/Blind75/FindMinRotatedContent';
import SearchRotatedSortedContent from '../components/Content/Blind75/SearchRotatedSortedContent';
import ThreeSumContent from '../components/Content/Blind75/ThreeSumContent';
import ContainerWithMostWaterContent from '../components/Content/Blind75/ContainerWithMostWaterContent';
import SumOfTwoIntegersContent from '../components/Content/Blind75/SumOfTwoIntegersContent';
import NumberOf1BitsContent from '../components/Content/Blind75/NumberOf1BitsContent';
import CountingBitsContent from '../components/Content/Blind75/CountingBitsContent';
import MissingNumberContent from '../components/Content/Blind75/MissingNumberContent';
import ReverseBitsContent from '../components/Content/Blind75/ReverseBitsContent';
import ClimbingStairsContent from '../components/Content/Blind75/ClimbingStairsContent';
import CoinChangeContent from '../components/Content/Blind75/CoinChangeContent';
import LISContent from '../components/Content/Blind75/LISContent';
import LCSContent from '../components/Content/Blind75/LCSContent';
import WordBreakContent from '../components/Content/Blind75/WordBreakContent';
import CombinationSumContent from '../components/Content/Blind75/CombinationSumContent';
import HouseRobberContent from '../components/Content/Blind75/HouseRobberContent';
import HouseRobberIIContent from '../components/Content/Blind75/HouseRobberIIContent';
import DecodeWaysContent from '../components/Content/Blind75/DecodeWaysContent';
import UniquePathsContent from '../components/Content/Blind75/UniquePathsContent';
import JumpGameContent from '../components/Content/Blind75/JumpGameContent';
import CloneGraphContent from '../components/Content/Blind75/CloneGraphContent';
import PacificAtlanticContent from '../components/Content/Blind75/PacificAtlanticContent';
import CourseScheduleContent from '../components/Content/Blind75/CourseScheduleContent';
import NumberOfIslandsContent from '../components/Content/Blind75/NumberOfIslandsContent';
import LongestSubstringContent from '../components/Content/Blind75/LongestSubstringContent';
import CharacterReplacementContent from '../components/Content/Blind75/CharacterReplacementContent';
import SetMatrixZeroesContent from '../components/Content/Blind75/SetMatrixZeroesContent';
import SpiralMatrixContent from '../components/Content/Blind75/SpiralMatrixContent';
import RotateImageContent from '../components/Content/Blind75/RotateImageContent';
import ReverseLinkedListContent from '../components/Content/Blind75/ReverseLinkedListContent';
import LinkedListCycleContent from '../components/Content/Blind75/LinkedListCycleContent';
import InvertBinaryTreeContent from '../components/Content/Blind75/InvertBinaryTreeContent';
import MaxDepthContent from '../components/Content/Blind75/MaxDepthContent';
import SameTreeContent from '../components/Content/Blind75/SameTreeContent';
import LevelOrderContent from '../components/Content/Blind75/LevelOrderContent';
import SubtreeContent from '../components/Content/Blind75/SubtreeContent';
import InsertIntervalContent from '../components/Content/Blind75/InsertIntervalContent';
import MergeIntervalsContent from '../components/Content/Blind75/MergeIntervalsContent';
import NonOverlappingIntervalsContent from '../components/Content/Blind75/NonOverlappingIntervalsContent.jsx';
import TopKFrequentContent from '../components/Content/Blind75/TopKFrequentContent.jsx';
import FindMedianContent from '../components/Content/Blind75/FindMedianContent.jsx';
import ValidateBSTContent from '../components/Content/Blind75/ValidateBSTContent.jsx';
import LCAContent from '../components/Content/Blind75/LCAContent.jsx';
import TrieContent from '../components/Content/Blind75/TrieContent.jsx';
import WordSearchContent from '../components/Content/Blind75/WordSearchContent.jsx';
import MergeKListsContent from '../components/Content/Blind75/MergeKListsContent.jsx';

const topicComponents = {
    'intro': IntroContent,
    'stl-containers': STLContainers,
    'memory': MemoryManagement,
    'sliding-window': SlidingWindowContent,
    'two-pointers': TwoPointersContent,
    'pointers': PointersContent,
    'arrays': ArraysContent,
    'linked-lists': LinkedListContent,
    'stacks-queues': StacksQueuesContent,
    'trees': TreesContent,
    'heaps': HeapsContent,
    'tries': TriesContent,
    'sets-maps': SetsMapsContent,
    'graphs': GraphsContent,
    'recursion': RecursionContent,
    'fast-slow-pointers': FastSlowPointersContent,

    'cyclic-sort': CyclicSortContent,
    'in-place-reversal': InPlaceReversalContent,
    'tree-bfs-dfs': TreeBFSDFSContent,
    'two-heaps': TwoHeapsContent,
    'subsets': SubsetsContent,
    'modified-binary-search': ModifiedBinarySearchContent,
    'bitwise-xor': BitwiseXORContent,
    'top-k-elements': TopKElementsContent,
    'k-way-merge': KWayMergeContent,
    'topological-sort': TopologicalSortContent,
    'dynamic-programming': DPContent,
    'greedy': GreedyContent,
    'union-find': UnionFindContent,
    'monotonic-stack': MonotonicStackContent,
    'dijkstra': DijkstraContent,
    'two-sum': TwoSumContent,
    'best-time-stock': StockContent,
    'contains-duplicate': ContainsDuplicateContent,
    'product-except-self': ProductExceptSelfContent,
    'maximum-subarray': MaxSubarrayContent,
    'maximum-product-subarray': MaxProductSubarrayContent,
    'find-min-rotated': FindMinRotatedContent,
    'search-rotated-sorted': SearchRotatedSortedContent,
    '3sum': ThreeSumContent,
    'container-with-most-water': ContainerWithMostWaterContent,
    'sum-of-two-integers': SumOfTwoIntegersContent,
    'number-of-1-bits': NumberOf1BitsContent,
    'counting-bits': CountingBitsContent,
    'missing-number': MissingNumberContent,
    'reverse-bits': ReverseBitsContent,
    'climbing-stairs': ClimbingStairsContent,
    'coin-change': CoinChangeContent,
    'longest-increasing-subsequence': LISContent,
    'longest-common-subsequence': LCSContent,
    'word-break': WordBreakContent,
    'combination-sum': CombinationSumContent,
    'house-robber': HouseRobberContent,
    'house-robber-ii': HouseRobberIIContent,
    'decode-ways': DecodeWaysContent,
    'unique-paths': UniquePathsContent,
    'jump-game': JumpGameContent,
    'clone-graph': CloneGraphContent,
    'pacific-atlantic': PacificAtlanticContent,
    'course-schedule': CourseScheduleContent,
    'number-of-islands': NumberOfIslandsContent,
    'longest-substring': LongestSubstringContent,
    'character-replacement': CharacterReplacementContent,
    'set-matrix-zeroes': SetMatrixZeroesContent,
    'spiral-matrix': SpiralMatrixContent,
    'rotate-image': RotateImageContent,
    'reverse-linked-list': ReverseLinkedListContent,
    'linked-list-cycle': LinkedListCycleContent,
    'invert-binary-tree': InvertBinaryTreeContent,
    'maximum-depth-binary-tree': MaxDepthContent,
    'same-tree': SameTreeContent,
    'binary-tree-level-order-traversal': LevelOrderContent,
    'subtree-of-another-tree': SubtreeContent,
    'insert-interval': InsertIntervalContent,
    'merge-intervals': MergeIntervalsContent,
    'non-overlapping-intervals': NonOverlappingIntervalsContent,
    'top-k-frequent-elements': TopKFrequentContent,
    'find-median-from-data-stream': FindMedianContent,
    'validate-binary-search-tree': ValidateBSTContent,
    'lowest-common-ancestor-of-a-binary-search-tree': LCAContent,
    'implement-trie-prefix-tree': TrieContent,
    'word-search': WordSearchContent,
    'merge-k-sorted-lists': MergeKListsContent,
};

const ModulePage = () => {
    const { moduleId, topicId } = useParams();

    const module = modules.find(m => m.id === moduleId);
    const topic = module?.topics.find(t => t.id === topicId);
    const ContentComponent = topicComponents[topicId];

    if (!module || !topic) {
        return <div style={{ padding: '2rem' }}>Topic not found</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h4 style={{ color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
                    {module.title}
                </h4>
                <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{topic.title}</h1>
                <div style={{ height: '4px', width: '60px', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px' }}>
                {ContentComponent ? (
                    <ContentComponent />
                ) : (
                    <div>
                        <p>Content for <strong>{topic.title}</strong> is coming soon.</p>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Type: {topic.type}</p>
                        {/* Placeholder for future content */}
                        {topic.type === 'interactive' && (
                            <div style={{ marginTop: '2rem', padding: '2rem', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                                Interactive Visualizer Placeholder
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModulePage;
